var _ = require("underscore");
var vnum = require("../lib/codec");
var f = require("../lib/functional");

// Temporary functions - to be moved

//function encodeUByte(bytebuf, byte) {
//  //var newOffset = bytebuf.buf.writeUInt8(byte, bytebuf.offset);
//  //return {buf: bytebuf.buf, offset: newOffset};
//  var newOffset = bytebuf.buf.writeUInt8(byte, bytebuf.offset);
//  bytebuf.offset = newOffset;
//  return newOffset;
//}

var mEncodeUByte = f.lift(vnum.encodeUByte, _.identity);
var mDecodeUByte = f.lift(vnum.decodeUByte, _.identity);

// Test functions

function totalBytes(values, _) {
  return values[values.length - 1];
}

function decodedValues(values, _) {
  return values;
}

//function identityValues(values, _) { return values; }
//function logState(elem) {
//  console.log(elem.buf.toJSON());
//  console.log(elem.offset);
//}

var singleByteEncode = f.actions([mEncodeUByte(0xA0)], totalBytes);
var multiByteEncode = f.actions([mEncodeUByte(0xA0), mEncodeUByte(0xA1)], totalBytes);

var singleByteDecode = f.actions([mDecodeUByte()], decodedValues);
var multiByteDecode = f.actions([mDecodeUByte(), mDecodeUByte()], decodedValues);

//var multiByteEncodeInter = f.actions([mEncodeUByte(0xA0), mEncodeUByte(0xA1)], identityValues);

// Tests

describe("Encoder", function() {
  //it("can encode a multiple bytes with pipeline logging intermediate state", function() {
  //  var stackAction = f.actions([mEncodeUByte(0xA0), mEncodeUByte(0xA1)],
  //      function(values, state) {
  //        return values;
  //      });
  //  var ret = stackAction({buf: new Buffer(2), offset: 0});
  //  console.log("Final");
  //  console.log(ret)
  //});
  //it("can encode a multiple bytes with pipeline logging intermediate state", function() {
  //  var initial = {buf: new Buffer(2), offset: 0};
  //  var result = f.pipeline(initial, multiByteEncodeInter, _.chain).each(logState);
  //  console.log(result)
  //  expect(result.buf.readUInt8(0)).toBe(0xA0);
  //  expect(result.buf.readUInt8(1)).toBe(0xA1);
  //  expect(result.offset).toBe(2);
  //});
  it("can encode a multiple bytes with actions", function() {
    var bytebuf = {buf: new Buffer(2), offset: 0};
    expect(multiByteEncode(bytebuf)).toBe(2);
    expect(multiByteDecode({buf: bytebuf.buf, offset: 0})).toEqual([0xA0, 0xA1]);
  });
  it("can encode a single byte with actions", function() {
    var bytebuf = {buf: new Buffer(1), offset: 0};
    expect(singleByteEncode(bytebuf)).toBe(1);
    expect(singleByteDecode({buf: bytebuf.buf, offset: 0})).toEqual([0xA0]);
  });
  it("can encode a single byte", function() {
    var bytebuf = {buf: new Buffer(1), offset: 0};
    expect(vnum.encodeUByte(bytebuf, 0xA0)).toBe(1);
    expect(vnum.decodeUByte({buf: bytebuf.buf, offset: 0})).toBe(0xA0);
  })
});

//describe("Unchecked variable number encoder", function() {
//  it("can encode positive numbers", function() {
//    var buf = new Buffer(1);
//    var result = vnum.encode(buf)(0, 0);
//    expect(result.offset).toBe(1);
//    expect(result.buffer.readUInt8()).toBe(0);
//  });
//  it("can encode using pipeline", function() {
//    var encBuf = vnum.encode(new Buffer(1));
//    var result = f.pipeline(encBuf(0, 0));
//    expect(result.offset).toBe(1);
//    expect(result.buffer.readUInt8()).toBe(0);
//  });
//
//  it("can encode2 positive numbers", function() {
//    var buf = new Buffer(1);
//    var result = vnum.encode2(buf, 0)(0);
//    expect(result.offset).toBe(1);
//    expect(result.buffer.readUInt8()).toBe(0);
//  });
//  it("can encode2 a single number using pipeline", function() {
//    var encBuf = vnum.encode2(new Buffer(1), 0);
//    var result = f.pipeline(encBuf(0));
//    expect(result.offset).toBe(1);
//    expect(result.buffer.readUInt8()).toBe(0);
//  });
//  //it("can encode2 multiple numbers using pipeline", function() {
//  //  var encBuf = vnum.encode2(new Buffer(1), 0);
//  //  var result = f.pipeline(encBuf(0), encBuf(0));
//  //  expect(result.offset).toBe(1);
//  //  expect(result.buffer.readUInt8()).toBe(0);
//  //});
//
//  //it("can encode using pipeline", function() {
//  //  var enc0off0 = f.partial2(vnum.encode, 0, 0);
//  //  var result = f.pipeline(new Buffer(1), enc0off0);
//  //  expect(result.offset).toBe(1);
//  //  expect(result.buffer.readUInt8()).toBe(0);
//  //});
//});

//describe("A suite", function() {
//  it("contains spec with an expectation", function() {
//    expect(true).toBe(true);
//  });
//});