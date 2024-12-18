pub mod lino {

    use pest::error::Error;
    use pest::iterators::{Pair, Pairs};
    use pest::Parser;
    use std::fmt;
    // use std::mem;

    #[derive(Debug, Clone)]
    pub enum LiNo<T> {
        Link { id: Option<T>, values: Vec<Self> },
        Ref(T),
    }

    impl<T> LiNo<T> {
        pub fn is_ref(&self) -> bool {
            matches!(self, LiNo::Ref(_))
        }

        pub fn is_link(&self) -> bool {
            matches!(self, LiNo::Link { .. })
        }
    }

    impl<T: ToString> fmt::Display for LiNo<T> {
        fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
            match self {
                LiNo::Ref(value) => write!(f, "{}", value.to_string()),
                LiNo::Link { id, values } => {
                    let id_str = id
                        .as_ref()
                        .map(|id| format!("{}: ", id.to_string()))
                        .unwrap_or_default();

                    if f.alternate() {
                        // Format top-level as lines
                        let lines = values
                            .iter()
                            .map(|value| format!("{}{}", id_str, value))
                            .collect::<Vec<_>>()
                            .join("\n");
                        write!(f, "{}", lines)
                    } else {
                        let values_str = values
                            .iter()
                            .map(|value| value.to_string())
                            .collect::<Vec<_>>()
                            .join(" ");
                        write!(f, "({}{})", id_str, values_str)
                    }
                }
            }
        }
    }

    #[derive(pest_derive::Parser)]
    #[grammar = "Test.pest"]
    struct LiNoParser;

    fn parse_link_or_ref(pair: Pair<Rule>) -> LiNo<String> {
        match pair.as_rule() {
            Rule::link => {
                let mut id = None;
                let mut values = Vec::new();

                let mut pairs = pair.into_inner();
                let first = pairs.next().unwrap();

                if first.as_rule() == Rule::id {
                    id = Some(first.as_str().to_string());
                } else {
                    values.push(parse_link_or_ref(first));
                }

                for value in pairs {
                    values.push(parse_link_or_ref(value));
                }
                if values.len() == 1 {
                    if let LiNo::Ref(val) = values.pop().unwrap() {
                        LiNo::Ref(val)
                    } else {
                        LiNo::Link { id, values }
                    }
                } else {
                    LiNo::Link { id, values }
                }
            }
            Rule::reference => LiNo::Ref(pair.as_str().to_string()),
            _ => unreachable!(),
        }
    }

    fn parse_lino_values(pairs: Pairs<Rule>) -> Result<Vec<LiNo<String>>, Error<Rule>> {
        let mut result = Vec::new();
        let pairs: Vec<_> = pairs.collect();
        for i in 0..pairs.len() {
            let pair = pairs[i].clone();
            if pair.as_rule() == Rule::children {
                continue;
            }
            let value = parse_link_or_ref(pair);
            if let Some(children) = pairs.get(i + 1) {
                if children.as_rule() == Rule::children {
                    for child in children.clone().into_inner() {
                        let child = parse_link_or_ref(child);
                        match child {
                            LiNo::Link { id, values } => {
                                result.push(LiNo::Link {
                                    id,
                                    values: [vec![value.clone()], values].concat(),
                                });
                            }
                            LiNo::Ref(id) => {
                                result.push(LiNo::Link {
                                    id: None,
                                    values: vec![value.clone(), LiNo::Ref(id)],
                                });
                            }
                        }
                    }
                }
            }
            result.push(value);
        }
        Ok(result)
    }

    pub fn parse_lino(document: &str) -> Result<LiNo<String>, Error<Rule>> {
        let document = LiNoParser::parse(Rule::document, document)?.next().unwrap();

        let root = LiNo::Link {
            id: None,
            values: parse_lino_values(document.into_inner())?,
        };

        Ok(root)
    }
}

#[cfg(test)]
mod tests {
    use super::lino::*;

    #[test]
    fn test_simple_link() {
        let input = "(1: 1 1)";
        let parsed = parse_lino(input).expect("Failed to parse input");

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
        let parsed = parse_lino(input).expect("Failed to parse input");

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
        let parsed = parse_lino(input).expect("Failed to parse input");

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
        let parsed = parse_lino(input).expect("Failed to parse input");

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
        assert!(!reference.is_link());
    }

    #[test]
    fn test_is_link() {
        let link = LiNo::Link {
            id: Some("id".to_string()),
            values: vec![LiNo::Ref("child".to_string())],
        };
        assert!(link.is_link());
        assert!(!link.is_ref());
    }

    #[test]
    fn test_empty_link() {
        let link = LiNo::Link::<String> {
            id: None,
            values: vec![],
        };
        let output = link.to_string();
        assert_eq!(output, "()");
    }

    #[test]
    fn test_nested_links() {
        let input = "(1: (2: (3: 3)))";
        let parsed = parse_lino(input).expect("Failed to parse input");

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
        let result = parse_lino(input);
        assert!(result.is_err());
    }
}