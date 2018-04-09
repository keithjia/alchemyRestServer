install deps:
npm i

test:
npm test

start server at 8080:
npm start

Notes:
1) restify rest error objects are slightly different than spec: I kind of the lef the default format, which is more REST compliant anyway


Security konwn issues notes:
1) not https
2) password should be at least hashed, but currently stored as clear text
3) session injection with session token
4) no session token reuse, or timeout
5) I am going to vastly simplify file upload. instead od using multipart and supporting a lot of features. I am simply making file content a json field. Client is responsible for submitting the fileContent in a json format. client will need to deal with encoding and decoding issues with binary stuff
6) API didn't define a logout. pretty dangerous obviously
