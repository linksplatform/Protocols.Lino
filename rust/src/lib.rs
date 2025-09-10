pub mod parser;

use std::fmt;

#[derive(Debug, Clone, PartialEq)]
pub enum Ln<T> {
    Link { id: Option<T>, values: Vec<Self> },
    Ref(T),
}

impl<T> Ln<T> {
    pub fn is_ref(&self) -> bool {
        matches!(self, Ln::Ref(_))
    }

    pub fn is_link(&self) -> bool {
        matches!(self, Ln::Link { .. })
    }
}

impl<T: ToString> fmt::Display for Ln<T> {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            Ln::Ref(value) => write!(f, "{}", value.to_string()),
            Ln::Link { id, values } => {
                let id_str = id
                    .as_ref()
                    .map(|id| format!("{}: ", id.to_string()))
                    .unwrap_or_default();

                if f.alternate() {
                    // Format top-level as lines
                    let lines = values
                        .iter()
                        .map(|value| {
                            // For alternate formatting, ensure standalone references are wrapped in parentheses
                            // so that flattened structures like indented blocks render as "(ref)" lines
                            match value {
                                Ln::Ref(_) => format!("{}({})", id_str, value),
                                _ => format!("{}{}", id_str, value),
                            }
                        })
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

// Convert from parser::Link to Ln (without flattening)
impl From<parser::Link> for Ln<String> {
    fn from(link: parser::Link) -> Self {
        if link.values.is_empty() && link.children.is_empty() {
            if let Some(id) = link.id {
                Ln::Ref(id)
            } else {
                Ln::Link { id: None, values: vec![] }
            }
        } else {
            let values: Vec<Ln<String>> = link.values.into_iter().map(|v| v.into()).collect();
            Ln::Link { id: link.id, values }
        }
    }
}

// Helper function to flatten indented structures according to Ln spec
fn flatten_links(links: Vec<parser::Link>) -> Vec<Ln<String>> {
    let mut result = vec![];
    
    for link in links {
        flatten_link_recursive(&link, None, &mut result);
    }
    
    result
}

fn flatten_link_recursive(link: &parser::Link, parent: Option<Ln<String>>, result: &mut Vec<Ln<String>>) {
    // Create the current link without children
    let current = if link.values.is_empty() {
        if let Some(id) = &link.id {
            Ln::Ref(id.clone())
        } else {
            Ln::Link { id: None, values: vec![] }
        }
    } else {
        let values: Vec<Ln<String>> = link.values.iter().map(|v| {
            parser::Link {
                id: v.id.clone(),
                values: v.values.clone(),
                children: vec![]
            }.into()
        }).collect();
        Ln::Link { id: link.id.clone(), values }
    };
    
    // Create the combined link (parent + current) with proper wrapping
    let combined = if let Some(parent) = parent {
        // Wrap parent in parentheses if it's a reference
        let wrapped_parent = match parent {
            Ln::Ref(ref_id) => Ln::Link { id: None, values: vec![Ln::Ref(ref_id)] },
            link => link
        };
        
        // Wrap current in parentheses if it's a reference
        let wrapped_current = match current.clone() {
            Ln::Ref(ref_id) => Ln::Link { id: None, values: vec![Ln::Ref(ref_id)] },
            link => link
        };
        
        Ln::Link { 
            id: None, 
            values: vec![wrapped_parent, wrapped_current]
        }
    } else {
        current.clone()
    };
    
    result.push(combined.clone());
    
    // Process children
    for child in &link.children {
        flatten_link_recursive(child, Some(combined.clone()), result);
    }
}

pub fn parse_ln(document: &str) -> Result<Ln<String>, String> {
    // Handle empty or whitespace-only input by returning empty result
    if document.trim().is_empty() {
        return Ok(Ln::Link { id: None, values: vec![] });
    }
    
    match parser::parse_document(document) {
        Ok((_, links)) => {
            if links.is_empty() {
                Ok(Ln::Link { id: None, values: vec![] })
            } else {
                // Flatten the indented structure according to Ln spec
                let flattened = flatten_links(links);
                Ok(Ln::Link { id: None, values: flattened })
            }
        }
        Err(e) => Err(format!("Parse error: {:?}", e))
    }
}

// New function that matches C# and JS API - returns collection of links
pub fn parse_ln_to_links(document: &str) -> Result<Vec<Ln<String>>, String> {
    // Handle empty or whitespace-only input by returning empty collection
    if document.trim().is_empty() {
        return Ok(vec![]);
    }
    
    match parser::parse_document(document) {
        Ok((_, links)) => {
            if links.is_empty() {
                Ok(vec![])
            } else {
                // Flatten the indented structure according to Ln spec
                let flattened = flatten_links(links);
                Ok(flattened)
            }
        }
        Err(e) => Err(format!("Parse error: {:?}", e))
    }
}

