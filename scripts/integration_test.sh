#!/usr/bin/expect

################################################################################
# Integration test for our REPL.
#
# Tests that our bootstrapping code is wired up and that we get a REPL we can
# interact with via stdin and stdout.
#
# Intended to be called with a timeout shorter than 10 so that we can fail with
# a nice error code if we don't get the responses we expect.
# (e.g. timeout 5 ./scripts/integration_test.sh)
################################################################################

set timeout 10

spawn yarn start repl

expect ">"
send "BLAH\n"

expect ") ERROR, Unknown command 'BLAH'"

send "ADD foo bar\n"
expect ") Added"

send "KEYS\n"
expect "1) foo"

exit 0

