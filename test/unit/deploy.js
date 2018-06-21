const chai = require('chai');
const expect = chai.expect;

const { shouldBeZipped, handleFile } = require('../../src/deploy');

describe('#shouldBeZipped()', () => {
  it('should return true for all if --gzip', () => {
    const gzip = true;
    expect(shouldBeZipped('/path/file.js', gzip)).to.equal(true);
    expect(shouldBeZipped('/path/file.mp4', gzip)).to.equal(true);
    expect(shouldBeZipped('/path/file.js.mp4', gzip)).to.equal(true);
    expect(shouldBeZipped('/path/file.', gzip)).to.equal(true);
  });

  it('should return false if no --gzip', () => {
    expect(shouldBeZipped('/path/file.js', undefined)).to.equal(false);
    expect(shouldBeZipped('/path/file.js', false)).to.equal(false);
    expect(shouldBeZipped('/path/file.js', 'false')).to.equal(false);
  });

  it('should return true for provided file extensions', () => {
    const gzip = ['js', 'css', 'html'];
    expect(shouldBeZipped('/path/file.js', gzip)).to.equal(true);
  });

  it('should return false for all unknown extensions', () => {
    const gzip = ['js', 'css', 'html'];
    expect(shouldBeZipped('/path/file.mp4', gzip)).to.equal(false);
    expect(shouldBeZipped('/path/file.js.mp4', gzip)).to.equal(false);
    expect(shouldBeZipped('/path/file.', gzip)).to.equal(false);
  });
});

describe('#handleFile()', () => {
  it('should upload file', done => {
    const console = {
      log(msg) {
        expect(msg).to.equal('Uploaded: my-bucket/deploy.js');
        done();
      },
      error: done
    };
    const s3Client = {
      headObject(params, cb) {
        cb(null, {});
      },
      putObject(params, cb) {
        cb(null, {});
      }
    };

    handleFile(__filename, s3Client, { Bucket: 'my-bucket' }, { cwd: __dirname, console }).catch(done);
  });
});
