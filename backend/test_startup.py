import sys
import traceback

with open('startup_log.txt', 'w') as f:
    try:
        f.write("Starting...\n")
        import main
        f.write("Import successful.\n")
    except Exception as e:
        f.write(traceback.format_exc())
