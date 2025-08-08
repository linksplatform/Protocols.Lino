use lino::parse_lino;

fn main() {
    let notation = r#"
  (Type: Type Type)
    Number
    String
    Array
    Value
  "#;

    match parse_lino(notation) {
        Ok(result) => {
            println!("Parsed object:\n{:#?}", result);
            let back_to_string = result.to_string(); // Преобразуем обратно в строку
            println!("\nReconstructed notation:\n{}", back_to_string);
        }
        Err(error) => eprintln!("Error: {:?}", error),
    }
}