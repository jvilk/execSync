var spawn = require('child_process').spawn;
var fs = require('fs');
var version = JSON.parse(fs.readFileSync(__dirname + '/package.json', 'utf8')).version;
var verbose = process.env['npm_package_config_verbose'] != null ? process.env['npm_package_config_verbose'] === 'true' : false;
var isWindows = require('os').platform().indexOf('win') === 0;

console.log('[execsync v%s] Attempting to compile native extensions.', version);

// While node-gyp is runnable in Windows from the command line as `node-gyp`,
// it's actually defined in the file `node-gyp.cmd`.
// Relevant bug: https://github.com/joyent/node/issues/2318
var gyp = spawn(isWindows ? 'node-gyp.cmd' : 'node-gyp', ['rebuild'], {cwd: __dirname});
gyp.stdout.on('data', function(data) {
  if (verbose) process.stdout.write(data);
});
gyp.stderr.on('data', function(data) {
  if (verbose) process.stdout.write(data);
});
gyp.on('error', function(err) {
  console.error(err);
});
gyp.on('close', function(code) {
    if (code !== 0) {
        console.log("[execSync v%s]", version);
        console.log('    Native code compile failed!!');
        if (require('os').platform().indexOf('win') === 0) {
          console.log('    Will try to use win32 extension.');
      }
    } else {
        console.log('[execSync v%s] Native extension compilation successful!', version);
    }
});