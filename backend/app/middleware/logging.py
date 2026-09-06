import logging


logger = logging.getLogger("mplad_guard")

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s"
)


def log_info(message: str):
    logger.info(message)


def log_error(message: str):
    logger.error(message)
