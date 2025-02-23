#![feature(iter_intersperse)]

mod lino;

pub use lino::LiNo;

pub fn parse_str(str: &str) -> Result<LiNo<String>, ()> {
  Ok(LiNo::Ref(String::new()))
}

#[cfg(test)]
mod tests {
  use super::*;

  #[test]
  fn test_simple_link() {
    let input = "(1: 1 1)";
    let parsed = parse_str(input).expect("Failed to parse input");

    // Validate regular formatting
    let output = parsed.to_string();
    let expected = "((1: 1 1))"; // Expected regular output
    assert_eq!(expected, output);

    // Validate alternate formatting
    let output_alternate = format!("{:#}", parsed);
    assert_eq!(input, output_alternate);
  }

  #[test]
  fn test_multiline_simple_links() {
    let input = "(1: 1 1)\n(2: 2 2)";
    let parsed = parse_str(input).expect("Failed to parse input");

    // Validate regular formatting
    let output = parsed.to_string();
    let expected = "((1: 1 1) (2: 2 2))"; // Expected regular output
    assert_eq!(expected, output);

    // Validate alternate formatting
    let output_alternate = format!("{:#}", parsed);
    assert_eq!(input, output_alternate);
  }

  #[test]
  fn test_link_with_source_target() {
    let input = "(index: source target)";
    let parsed = parse_str(input).expect("Failed to parse input");

    // Validate regular formatting
    let output = parsed.to_string();
    let expected = "((index: source target))"; // Expected regular output
    assert_eq!(expected, output);

    // Validate alternate formatting
    let output_alternate = format!("{:#}", parsed);
    assert_eq!(input, output_alternate);
  }

  #[test]
  fn test_link_with_source_type_target() {
    let input = "(index: source type target)";
    let parsed = parse_str(input).expect("Failed to parse input");

    // Validate regular formatting
    let output = parsed.to_string();
    let expected = "((index: source type target))"; // Expected regular output
    assert_eq!(expected, output);

    // Validate alternate formatting
    let output_alternate = format!("{:#}", parsed);
    assert_eq!(input, output_alternate);
  }

  #[test]
  fn test_is_ref() {
    let reference = LiNo::Ref("some_value".to_string());
    assert!(reference.is_ref());
    assert!(!reference.is_seq());
  }

  #[test]
  fn test_is_link() {
    let link = LiNo::Seq {
      id: Some("id".to_string()),
      values: vec![LiNo::Ref("child".to_string())],
    };
    assert!(link.is_seq());
    assert!(!link.is_ref());
  }

  #[test]
  fn test_empty_link() {
    let link = LiNo::Seq::<String> { id: None, values: vec![] };
    let output = link.to_string();
    assert_eq!(output, "()");
  }

  #[test]
  fn test_nested_links() {
    let input = "(1: (2: (3: 3)))";
    let parsed = parse_str(input).expect("Failed to parse input");

    panic!("{:?}", parsed);

    // Validate regular formatting
    let output = parsed.to_string();
    let expected = "((1: (2: (3: 3))))";
    assert_eq!(expected, output);

    // Validate alternate formatting
    let output_alternate = format!("{:#}", parsed);
    assert_eq!(input, output_alternate);
  }

  #[test]
  fn test_invalid_input() {
    let input = "(invalid";
    let result = parse_str(input);
    assert!(result.is_err());
  }
}
