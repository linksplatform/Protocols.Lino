use lino::parse_lino;

fn main() {
    println!("Testing multiline quotes as described in issue #53:");
    println!();

    let input = r#"(
  "long
string literal representing
the reference"

  'another
long string literal
as another reference'
)"#;

    println!("Input:");
    println!("{}", input);
    println!();

    match parse_lino(input) {
        Ok(result) => {
            println!("✓ Parsing succeeded!");
            println!("Parsed result: {:#?}", result);
        }
        Err(e) => {
            println!("✗ Parsing failed: {:?}", e);
        }
    }
}