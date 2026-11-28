const response = http.get(CODES_URL + '/?email=' + encodeURIComponent(EMAIL));
if (!response.ok) throw new Error(response.body);
output.code = response.body;
