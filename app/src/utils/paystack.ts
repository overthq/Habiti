// This file implements the Paystack iOS/Android-specific APIs,
// in JS only (meant for use in RN apps, without needing native deps).
// It's not complete yet, but the code is being translated from:
// https://github.com/PaystackHQ/paystack-ios/blob/master/Paystack/PSTCKAPIClient.m
// The general idea is to have feature parity with the iOS version,
// and then make this use FP as opposed to OOP.
// For now though, we can achieve the required behaviour with a webview.

const BASE_URL = 'https://standard.paystack.co';
const chargeEndpoint = 'charge/mobile_charge';
const validateEndpoint = 'charge/validate';
const requeryEndpoint = 'charge/requery/';
const avsEndpoint = 'charge/avs';
const paystackAPIVersion = '2017-05-25';

enum PaystackChargeStage {
	NoHandle,
	PlusHandle,
	ValidateToken,
	Requery,
	Authorize,
	AVS
}

export class Paystack {
	serverTransaction: any;

	// validUrl = (candidate: string) => {}

	makeChargeRequest = async (data: any, stage: PaystackChargeStage) => {
		let endpoint: string;
		let httpMethod: 'POST' | 'GET';

		switch (stage) {
			case PaystackChargeStage.NoHandle:
			case PaystackChargeStage.PlusHandle:
				endpoint = chargeEndpoint;
				httpMethod = 'POST';
				break;
			case PaystackChargeStage.ValidateToken:
				endpoint = validateEndpoint;
				httpMethod = 'POST';
				break;
			case PaystackChargeStage.Requery:
			case PaystackChargeStage.Authorize:
				endpoint = `${requeryEndpoint}${this.serverTransaction.id}`;
				httpMethod = 'GET';
				break;
			case PaystackChargeStage.AVS:
				endpoint = avsEndpoint;
				httpMethod = 'POST';
				break;
		}

		const response = await fetch(`${BASE_URL}/${endpoint}`, {
			method: httpMethod,
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				'Paystack-Version': paystackAPIVersion
			},
			body: JSON.stringify(data)
		});

		const responseObj = await response.json();

		if (responseObj !== null && responseObj.trans !== null) {
			console.log(responseObj.trans);
		}

		if (responseObj !== null && responseObj.reference !== null) {
			console.log(responseObj.reference);
		}

		if (responseObj.message.toLowerCase() === 'invalid data sent') {
			console.log(data);
		}

		if (
			responseObj.message.toLowerCase() === 'access code has expired' &&
			responseObj.status === '0'
		) {
			console.log(responseObj);
		}

		this.handleResponse(responseObj);
	};

	// requestPin = () => {};
	// requestAvs = () => {};
	// requestAuth = () => {};
	// requestOtp = () => {};

	handleResponse = (responseObj: any) => {
		if (responseObj.errors != null) {
			console.log('Error: ', responseObj.message);
		}
		if (responseObj.status === '1' || responseObj.status === 'success') {
			console.log('Success');
		} else if (
			responseObj.status === '2' &&
			responseObj.auth.toLowerCase() === 'avs'
		) {
			// requestAvs();
		} else if (
			responseObj.status === '2' ||
			responseObj.auth.toLowerCase() === 'pin'
		) {
			// requestPin();
		} else if (this.serverTransaction.id != null) {
			if (responseObj.auth.toLowerCase() === '3ds') {
			} else if (responseObj.status === '3') {
			} else if (responseObj.status.toLowerCase() === 'requery') {
				setTimeout(() => {
					this.makeChargeRequest(null, PaystackChargeStage.Requery);
				}, 3000);
			}
		}
	};
}
