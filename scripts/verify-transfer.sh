#!/bin/bash

curl -X POST -H "Content-Type: application/json" -d '{"transferId": "'$1'" }' http://localhost:4000/payments/verify-transfer