struct StructDemo {
  // leading comment
  1: required list<i32> Field1 (foo.bar = "value1") //   tailing comment
  // 123
  // 5678
  2: required list<i32> Field2 (annotation1 = "value1") //asdf
  3: string Field3 = ""
  i32 Field4 = 12345
  // fjfjfjfjf
} (aa.immutable = "d", dd.ffff = "StructDemo")

struct AAA {} 