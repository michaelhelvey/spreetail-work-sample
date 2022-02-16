#!/usr/bin/expect

set timeout 10

# Start a REPL
spawn yarn start repl

expect ">"
send "BLAH\n"

expect ") ERROR, Unknown command 'BLAH'"

send "ADD foo bar\n"
expect ") Added"

send "KEYS\n"
expect "1) foo"

exit 0



