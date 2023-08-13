To use this project make sure to follow the following steps:

Setup the prject folder as shown in this video - https://youtu.be/ItJ8deOYfDs

Insert the contract file in the following folder

..\ProjectFolder\src\contracts\

	generaltoken.ts

The following Files must be inserted project folder:

..\ProjectFolder\

	deploygen.ts
	interactGT00SetData.ts
	interactGT01Split.ts
	interactGT02Merge.ts
	interactGT03SaleOrder.ts
	interactGT04Buy.ts
	interactGT05ReadData.ts
	interactGT06MeltToken.ts

Make sure to insert the files in the (NeededCracks)*** folder in the respective folder:

*** Use always the newest version of the folder: 08/12/2023 (NeededCrack-scrypt-cli@0.1.43)

Place the Following Files in these folders

	..\node_modules\scrypt-ts\dist\providers\whatsonchain-provider.js
	..\node_modules\scrypt-ts\dist\providers\taal-provider.js
	..\node_modules\bsv\index.d.ts
	..\node_modules\bsv\lib\transaction\transaction.js
	..\node_modules\bsv\lib\privatekey.js
	..\node_modules\scrypt-ts\dist\bsv\wallets\test-wallet.js
