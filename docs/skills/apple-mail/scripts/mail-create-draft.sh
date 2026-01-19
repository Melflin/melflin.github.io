#!/bin/bash
# Create draft in Apple Mail (does not send)

if [ -z "$1" ] || [ -z "$2" ] || [ -z "$3" ]; then
  echo "Usage: $0 <to-email> <subject> <body> [from-account]"
  echo "Creates a draft email in Apple Mail Drafts folder (does NOT send)"
  exit 1
fi

TO="$1"
SUBJECT="$2"
BODY="$3"
FROM_ACCOUNT="${4:-}"

osascript <<EOF
set toAddress to "$TO"
set emailSubject to "$SUBJECT"
set emailBody to "$BODY"
set fromAccount to "$FROM_ACCOUNT"

tell application "Mail"
  set newMessage to make new outgoing message with properties {subject:emailSubject, content:emailBody, visible:false}
  
  tell newMessage
    make new to recipient at end of to recipients with properties {address:toAddress}
    
    -- Set from account if specified
    if fromAccount is not "" then
      set accountName to fromAccount
      repeat with acc in accounts
        if name of acc is accountName then
          set sender of newMessage to acc
          exit repeat
        end if
      end repeat
    end if
  end tell
  
  -- Draft is automatically saved to Drafts mailbox
  -- Do NOT send
  
  return "Draft created in Drafts folder for: " & toAddress
end tell
EOF
