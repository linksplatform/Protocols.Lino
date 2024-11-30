use lino::lino::parse_lino;

fn main() {
    let notation = r#"
  (Type: Type Type)
    Number
    String
    Array
    Value
  "#;
    match parse_lino(notation) {
        Ok(result) => println!("{:#?}", result),
        Err(error) => eprintln!("Error: {:?}", error),
    }
}
