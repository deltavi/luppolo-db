var fs = require('fs');

exports.printLogo = function (logoFileName, version) {
	try {
		const logo = fs.readFileSync(logoFileName);
		console.log('');
		console.log(logo.toString('utf8').replace('{version}', version));
		console.log('');
	}
	catch(error){
		console.error('Error reading logo file: ' + logoFileName, error);
	}
};
