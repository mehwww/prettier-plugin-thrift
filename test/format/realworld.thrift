// include "base.thrift"
include "base.thrift" // include base

struct AA {
  1: required i64 Field1 = "aaa",
}

/*
dasddd
*/

struct StructDemo {
  1: required list<i32> Field1 (foo.bar = "value1"), //   asdf
  // 5655
  // 8888
  2: required list<i32> Field1 (annotation1 = "value1"), //   asdf
} (aa.immutable='d', dd.ffff = 'StructDemo')


struct StructDemo {
  1: required i64 Field1, // comment1
  // comment2
  2: required string Field2,

  string Field3,
  EnumDemo Field4,

  3: optional i32 Field5 (annotation1 = "value1")

  /*
    comment3
  */
  255: optional base.Base Base,
} (annotation1 = "/api/v1/structdemo", annotation2 = "value2")

typedef map<string, string> Dict (annotation1 = "value1") // asdfasdf

enum EnumDemo{
  Item = 4 //Item
  Pic = 2 //Pic
  Video = 3 //Video
}

// service ServiceDemo {
//   void Method1(1: StructDemo Field1, 2: required string Field2) (annotation1 = "value1"),
//   void Method2(1: required i64 Field1, 2: optional StructDemo Field2) (annotation1 = "value1")
// } (annotation1 = "value1")

// struct StructDemo2 {
//   1: required i64 Field1,
//   2: required string Field2,
//   3: optional i32 Field3
// }

// Tail comment



/**
eeee
 */