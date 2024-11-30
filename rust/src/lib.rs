pub mod lino {

    use pest::error::{Error, ErrorVariant};
    use pest::iterators::{Pair, Pairs};
    use pest::Parser;
    // use std::mem;

    #[derive(Debug, Clone)]
    pub enum LiNo<T> {
        Link { id: Option<T>, values: Vec<Self> },
        Ref(T),
    }

    impl<T> LiNo<T> {
        fn is_ref(&self) -> bool {
            matches!(self, LiNo::Ref(_))
        }

        fn is_link(&self) -> bool {
            matches!(self, LiNo::Link { .. })
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

/// копилот, напиши тесты
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn it_works() {}
}
