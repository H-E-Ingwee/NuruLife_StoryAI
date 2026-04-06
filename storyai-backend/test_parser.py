#!/usr/bin/env python
"""Quick test of the script parser"""

from app.nlp.script_parser import parse_script

test_script = """INT. COFFEE SHOP - DAY

JOHN sits at a table with coffee.

CLOSE ON his hands trembling.

SARAH enters and approaches.
"""

try:
    result = parse_script(test_script)
    print("SUCCESS:")
    print(f"  Characters: {result.get('characters')}")
    print(f"  Locations: {result.get('locations')}")
    print(f"  Total shots: {result.get('total_shots')}")
    if result.get('shots'):
        print(f"  First shot keys: {list(result['shots'][0].keys())}")
        print(f"  First shot data:")
        for key, val in result['shots'][0].items():
            if key not in ['prompt', 'notes']:  # Skip long fields
                print(f"    {key}: {val}")
except Exception as e:
    import traceback
    print(f"ERROR: {e}")
    print(traceback.format_exc())
