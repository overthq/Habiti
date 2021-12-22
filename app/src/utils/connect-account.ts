export const SENDCASH_PAY_PUBLIC_KEY = '';

export const initSendcashPay = `
	SendcashPay.init({
    siteName: "Market",
		siteUrl: "https://github.com/overthq/Market",
    siteLogo: "<url to your logo>",
    publicKey: "<your Sendcash Pay public key>"
	});
	true;
`;

// FIXME: Make sure this cannot be used in some kind of attack.
export const connectAccount = (userId: string) => `
  const result = await SendcashPay.connect({
    userId: "${userId}"
	});
	window.ReactNativeWebView.postMessage(JSON.stringify(result));
	true;
`;

// This is probably a very bad idea, but I'm doing it for now anyway.

export const CONNECT_ACCOUNT_HTML = `
<html>
  <head>
    <script src="https://checkout.sendcashpay.com/lib/lib.bundle.js"></script>
  </head>
  <body>
  </body>
</html>
`;
