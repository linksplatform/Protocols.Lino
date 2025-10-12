use links_notation::parse_lino_to_links;

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn basic_indented_id_syntax_test() {
        let indented_syntax = "3:\n  papa\n  loves\n  mama";
        let inline_syntax = "(3: papa loves mama)";
        
        let indented_result = parse_lino_to_links(indented_syntax).unwrap();
        let inline_result = parse_lino_to_links(inline_syntax).unwrap();
        
        // Both should produce the same structure when formatted
        assert_eq!(indented_result.len(), 1);
        assert_eq!(inline_result.len(), 1);
        
        println!("Indented result: {:?}", indented_result);
        println!("Inline result: {:?}", inline_result);
        
        // Both should format to similar structure
        assert_eq!(format!("{}", indented_result[0]), format!("{}", inline_result[0]));
    }

    #[test]
    fn indented_id_single_value_test() {
        let input = "greeting:\n  hello";
        let result = parse_lino_to_links(input).unwrap();
        
        assert_eq!(result.len(), 1);
        assert_eq!(format!("{}", result[0]), "(greeting: hello)");
    }

    #[test]
    fn indented_id_multiple_values_test() {
        let input = "action:\n  run\n  fast\n  now";
        let result = parse_lino_to_links(input).unwrap();
        
        assert_eq!(result.len(), 1);
        assert_eq!(format!("{}", result[0]), "(action: run fast now)");
    }

    #[test]
    fn indented_id_numeric_test() {
        let input = "42:\n  answer\n  to\n  everything";
        let result = parse_lino_to_links(input).unwrap();
        
        assert_eq!(result.len(), 1);
        assert_eq!(format!("{}", result[0]), "(42: answer to everything)");
    }

    #[test]
    fn unsupported_colon_only_syntax_test() {
        let input = ":\n  papa\n  loves\n  mama";
        
        // This should fail
        assert!(parse_lino_to_links(input).is_err());
    }

    #[test]
    fn empty_indented_id_test() {
        let input = "empty:";
        let result = parse_lino_to_links(input).unwrap();
        
        assert_eq!(result.len(), 1);
        // For empty ID, it shows just the ID as a reference
        assert_eq!(format!("{}", result[0]), "empty");
    }
}