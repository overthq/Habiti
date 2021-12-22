export const SENDCASH_PAY_PUBLIC_KEY = 'this is a public key?';

// Passing the user id and public key like this is probably a very bad idea,
// but I'm doing it for now anyway.
export const connectAccountHtml = (userId: string) => `
<html>
  <head>
    <script src="https://checkout.sendcashpay.com/lib/lib.bundle.js"></script>
    <script>
			SendcashPay.init({
				siteName: "Market",
				siteUrl: "https://github.com/overthq/Market",
				siteLogo: "https://example.com/example.png",
				publicKey: "${SENDCASH_PAY_PUBLIC_KEY}"
			});

			setTimeout(async () => {
			  const result = await SendcashPay.connect({
				  userId: "${userId}"
			  });
			  window.ReactNativeWebView.postMessage(JSON.stringify(result));
			}, 1000);
    </script>
  </head>
  <body>
  </body>
</html>
`;
