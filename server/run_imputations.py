import os
import sys
import glob
import abc

from sklearn.preprocessing import StandardScaler
from pygrinder import mcar
from pypots.imputation import SAITS, USGAN, BRITS
from pypots.optim import Adam
import numpy as np
import pandas as pd

# GLOBAL VARIABLES
N_FEATURES = 6
N_EPOCHS = 10
COLUMNS = ["PM25", "PM10", "NO2", "CO", "O3", "SO2"]
ENABLE_ARTIFICIAL_MISSING_VALUES = False
TIME_STEPS = [32, 24, 18, 49, 9, 2, 61, 2, 68, 65, 10, 1, 88, 65, 1, 32, 1, 38, 62, 14]

# DIRS
PATH = os.path.dirname(os.path.abspath(__file__))

PATH_INPUT = os.path.join(PATH, "data", "series")
PATH_OUT = os.path.join(PATH, "out_input")

if not os.path.exists(PATH_INPUT):
    os.makedirs(PATH_INPUT)
if not os.path.exists(PATH_OUT):
    os.makedirs(PATH_OUT)


# Data loading
files = glob.glob(os.path.join(PATH_INPUT, "*.csv"))
if not files:
    print("THERE ARE NOT FILES")
    sys.exit()

files = sorted(files, key=lambda x: os.path.basename(x))
print("FILES:", files)

# utils
def get_shape(n_steps: int, len_df: int) -> int:
    return int(len_df / n_steps)


def process_imputed(id: str, label: str, df: pd.DataFrame, mask: pd.DataFrame) -> None:
    # Removing no imputed values and time col added
    df[~mask] = np.nan
    df["time"] = df["time"]

    # Export CSV
    df.to_csv(f"{PATH_OUT}/{label}_{id}.csv")


# PyPOTS
class Trainer(abc.ABC):
    @abc.abstractmethod
    def run(self, df: pd.DataFrame, n_steps: int) -> pd.DataFrame:
        raise NotImplementedError


# Concrete Implementations
class Saits(Trainer):
    def run(self, df: pd.DataFrame, n_steps: int) -> pd.DataFrame:
        aq = {"X": df}
        x_aq = aq["X"]

        # Normalization
        scaler = StandardScaler()
        x_aq = scaler.fit_transform(x_aq.to_numpy())

        shape_1 = int(len(df)/n_steps)

        # Reshaper
        x_aq = x_aq.reshape(shape_1, n_steps, -1)

        # MCAR artificial missing values generation: 10%
        x_aq = mcar(x_aq, 0.1)
        dataset = {"X": x_aq}

        # SAITS
        saits = SAITS(
            n_steps=n_steps,
            n_features=N_FEATURES,
            n_layers=2,
            d_model=256,
            d_inner=128,
            n_heads=4,
            d_k=64,
            d_v=64,
            dropout=0.1,
            epochs=N_EPOCHS,
        )

        saits.fit(dataset)
        imputation = saits.impute(dataset)

        # Regenerate Dataframe
        imputed = imputation.reshape(-1, imputation.shape[-1])
        imputed = scaler.inverse_transform(imputed)

        return pd.DataFrame(imputed, columns=COLUMNS)


class UsGan(Trainer):
    def run(self, df: pd.DataFrame, n_steps: int) -> pd.DataFrame:
        aq = {"X": df}
        x_aq = aq["X"]

        # Normalization
        scaler = StandardScaler()
        x_aq = scaler.fit_transform(x_aq.to_numpy())

        shape_1 = int(len(df)/n_steps)

        # Reshaper
        x_aq = x_aq.reshape(shape_1, n_steps, -1)

        # MCAR artificial missing values generation: 10%
        x_aq = mcar(x_aq, 0.1)
        dataset = {"X": x_aq}

        # USGAN
        us_gan = USGAN(
            n_steps=n_steps,
            n_features=N_EPOCHS,
            rnn_hidden_size=256,
            lambda_mse=1,
            G_steps=1,
            D_steps=1,
            batch_size=n_steps,
            epochs=N_EPOCHS,
            patience=3,
            G_optimizer=Adam(lr=1e-3),
            D_optimizer=Adam(lr=1e-3),
            num_workers=0,
            device="cpu",
            saving_path="tutorial_results/imputation/us_gan",
            model_saving_strategy="best",
        )

        us_gan.fit(dataset)
        imputation = us_gan.impute(dataset)

        # Regenerate Dataframe
        imputed = imputation.reshape(-1, imputation.shape[-1])
        imputed = scaler.inverse_transform(imputed)

        return pd.DataFrame(imputed, columns=COLUMNS)


class Brits(Trainer):
    def run(self, df: pd.DataFrame, n_steps: int) -> pd.DataFrame:
        aq = {"X": df}
        x_aq = aq["X"]

        # Normalization
        scaler = StandardScaler()
        x_aq = scaler.fit_transform(x_aq.to_numpy())

        # Reshaper
        x_aq = x_aq.reshape(get_shape(len(df), n_steps), n_steps, -1)

        # MCAR artificial missing values generation: 10%
        x_aq = mcar(x_aq, 0.1)
        dataset = {"X": x_aq}

        # BRITS
        brits = BRITS(
            n_steps=n_steps,
            n_features=6,
            rnn_hidden_size=128,
            batch_size=n_steps,
            epochs=10,
            patience=3,
            optimizer=Adam(lr=1e-3),
            num_workers=0,
            device="cpu",
            saving_path="tutorial_results/imputation/brits",
            model_saving_strategy="best",
        )

        brits.fit(dataset)
        imputation = brits.impute(dataset)

        # Regenerate Dataframe
        imputed = imputation.reshape(-1, imputation.shape[-1])
        imputed = scaler.inverse_transform(imputed)

        return pd.DataFrame(imputed, columns=COLUMNS)


# Imputation generator
def run():
    for index, path in enumerate(files):
        """
        Load .csv and impute with ALL methods
        """
        df = pd.read_csv(path)
        identifier = path.split("/")[-1].split(".")[0]

        # Drop unnecessary cols
        df_tmp = df.copy()
        df_tmp.drop(["time", "station_id"], inplace=True, axis=1)

        # Mask Matrix
        mask = df_tmp.isnull()

        # Run imputations
        gan = UsGan().run(df_tmp, int(TIME_STEPS[index]))
        saits = Saits().run(df_tmp, int(TIME_STEPS[index]))
        brits = Brits().run(df_tmp, int(TIME_STEPS[index]))

        # Process imputed dataframe
        process_imputed(identifier, "GAN", gan, mask)
        process_imputed(identifier, "BRITS", brits, mask)
        process_imputed(identifier, "SAITS", saits, mask)


if __name__ == "__main__":
    run()
