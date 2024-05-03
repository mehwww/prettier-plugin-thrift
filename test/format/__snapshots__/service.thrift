include "./struct.thrift"

service ServiceDemo extends aaa {
  /*//crowdedcomment*/
  void Method1(1: struct.StructDemo Field1, 2: required string Field2) (annotation1 = "value1") // eieiei
  i32 Method2(1: required i64 Field1, 2: optional struct.StructDemo Field2) (annotation1 = "valuhhe1")
  struct.StructDemo Method3(required i64 Req)
  // struct.StructDemo Method3(required i64 Req      )
} (annotation.x = "value1", annotation.y = "value1") //akakakakak
// fjasfjasdja