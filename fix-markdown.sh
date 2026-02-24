#!/bin/bash

# Script to fix common markdown linting issues
# Usage: ./fix-markdown.sh <file.md>

if [ $# -eq 0 ]; then
    echo "Usage: $0 <file.md>"
    exit 1
fi

FILE="$1"
BACKUP="${FILE}.backup"

# Create backup
cp "$FILE" "$BACKUP"

echo "Fixing markdown issues in $FILE..."

# Fix heading spacing (add blank line before headings)
sed -i '' 's/^## /\
\
## /g' "$FILE"
sed -i '' 's/^### /\
\
### /g' "$FILE"
sed -i '' 's/^#### /\
\
#### /g' "$FILE"
sed -i '' 's/^##### /\
\
##### /g' "$FILE"
sed -i '' 's/^###### /\
\
###### /g' "$FILE"

# Fix list spacing (add blank line before lists)
sed -i '' 's/^^- /\
\
- /g' "$FILE"
sed -i '' 's/^* /\
\
* /g' "$FILE"
sed -i '' 's/^1\. /\
\
1. /g' "$FILE"

# Fix code block spacing (add blank line before and after)
sed -i '' 's/^```/\
\
```/g' "$FILE"
sed -i '' 's/^```$/\
\
\
```/g' "$FILE"

# Fix bare URLs (wrap in angle brackets if not already)
sed -i '' 's/https:\/\/[^[:space:]]*/<&>/g' "$FILE"

echo "Markdown fixes applied to $FILE"
echo "Backup saved as $BACKUP"
