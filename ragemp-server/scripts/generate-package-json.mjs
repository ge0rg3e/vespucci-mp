import { readPackage } from 'read-pkg';
import { writePackage } from 'write-pkg';

function readPackageJson(folder) {
	try {
		return readPackage({
			normalize: false,
			...(folder && { cwd: folder })
		});
	} catch (e) {
		throw new Error(
			'Input package.json file does not exist or has bad format, check "inputFolder" option'
		);
	}
}

function writePackageJson(path, data) {
	try {
		return writePackage(path, data);
	} catch (e) {
		throw new Error('Unable to save generated package.json file, check "outputFolder" option');
	}
}

const options = {
	inputFolder: '.',
	outputFolder: './dist/'
};

console.log('Generating package.json file...');

const { inputFolder, outputFolder } = options;
const { dependencies } = await readPackageJson(inputFolder);

await writePackageJson(outputFolder, { dependencies });

console.log('Done!');
