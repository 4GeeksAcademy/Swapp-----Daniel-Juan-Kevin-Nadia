"""Generate Diagram"""
import os
from pathlib import Path
import subprocess
from datetime import datetime

db_url = os.getenv("DATABASE_URL", "sqlite:///local.db")

BASE_DIR = Path(__file__).resolve().parent.parent
OUTPUT_DIR = BASE_DIR / "diagrams"

os.makedirs(OUTPUT_DIR, exist_ok=True)

timestamp = datetime.now().strftime("%d%m%Y_%H%M%S")
OUTPUT_FILE = f"er_diagram-{timestamp}.png"

try:
    subprocess.run(["eralchemy", "-i", db_url, "-o",
                    OUTPUT_DIR / OUTPUT_FILE], check=True)
    print(f"+ Diagram: {OUTPUT_DIR / OUTPUT_FILE}")
except subprocess.CalledProcessError as e:
    print(f"- Error al generar el diagrama: {e}")
except FileNotFoundError:
    print("- No se encontró el comando 'eralchemy'.")
