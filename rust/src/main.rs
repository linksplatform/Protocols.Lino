use lino::parse_str;

fn main() {
  let notation = r#"
  (Type: Type Type)
    Number
    String
    Array
    Value
  "#;

  match parse_str(notation) {
    Ok(result) => {
      println!("Parsed object:\n{:#?}", result);
      let back_to_string = result.to_string();
      println!("\nReconstructed notation:\n{}", back_to_string);
    }
    Err(error) => eprintln!("Error: {:?}", error),
  }
}
