use lino::{parse_lino_to_links, LiNo};

#[test]
fn multiline_double_quoted_string_test() {
    let source = r#"("long
string literal representing
the reference")"#;
    let links = parse_lino_to_links(source).unwrap();
    assert_eq!(links.len(), 1);
    
    match &links[0] {
        LiNo::Link { id, values } => {
            assert_eq!(id, &None);
            assert_eq!(values.len(), 1);
            if let LiNo::Ref(ref_id) = &values[0] {
                assert_eq!(ref_id, "long\nstring literal representing\nthe reference");
            } else {
                panic!("Expected Ref variant, got: {:?}", values[0]);
            }
        }
        LiNo::Ref(ref_id) => {
            // Single references can be optimized to direct Ref
            assert_eq!(ref_id, "long\nstring literal representing\nthe reference");
        }
    }
}

#[test]
fn multiline_single_quoted_string_test() {
    let source = r#"('another
long string literal 
as another reference')"#;
    let links = parse_lino_to_links(source).unwrap();
    assert_eq!(links.len(), 1);
    
    match &links[0] {
        LiNo::Link { id, values } => {
            assert_eq!(id, &None);
            assert_eq!(values.len(), 1);
            if let LiNo::Ref(ref_id) = &values[0] {
                assert_eq!(ref_id, "another\nlong string literal \nas another reference");
            } else {
                panic!("Expected Ref variant, got: {:?}", values[0]);
            }
        }
        LiNo::Ref(ref_id) => {
            // Single references can be optimized to direct Ref
            assert_eq!(ref_id, "another\nlong string literal \nas another reference");
        }
    }
}

#[test]
fn issue_53_example_test() {
    // Test the exact example from issue #53
    let source = r#"(
  "long
string literal representing
the reference"
  
  'another
long string literal 
as another reference'
)"#;
    let links = parse_lino_to_links(source).unwrap();
    assert_eq!(links.len(), 1);
    
    if let LiNo::Link { id, values } = &links[0] {
        assert_eq!(id, &None);
        assert_eq!(values.len(), 2);
        
        if let LiNo::Ref(ref_id1) = &values[0] {
            assert_eq!(ref_id1, "long\nstring literal representing\nthe reference");
        } else {
            panic!("Expected first value to be Ref variant");
        }
        
        if let LiNo::Ref(ref_id2) = &values[1] {
            assert_eq!(ref_id2, "another\nlong string literal \nas another reference");
        } else {
            panic!("Expected second value to be Ref variant");
        }
    } else {
        panic!("Expected Link variant");
    }
}

#[test]
fn multiline_string_with_id_test() {
    let source = r#"(myId: "first
multiline
value" 'second
multiline
value')"#;
    let links = parse_lino_to_links(source).unwrap();
    assert_eq!(links.len(), 1);
    
    if let LiNo::Link { id, values } = &links[0] {
        assert_eq!(id, &Some("myId".to_string()));
        assert_eq!(values.len(), 2);
        
        if let LiNo::Ref(ref_id1) = &values[0] {
            assert_eq!(ref_id1, "first\nmultiline\nvalue");
        } else {
            panic!("Expected first value to be Ref variant");
        }
        
        if let LiNo::Ref(ref_id2) = &values[1] {
            assert_eq!(ref_id2, "second\nmultiline\nvalue");
        } else {
            panic!("Expected second value to be Ref variant");
        }
    } else {
        panic!("Expected Link variant");
    }
}

#[test]
fn mixed_single_and_multiline_string_test() {
    let source = r#"(normal "multi
line" single)"#;
    let links = parse_lino_to_links(source).unwrap();
    assert_eq!(links.len(), 1);
    
    if let LiNo::Link { id, values } = &links[0] {
        assert_eq!(id, &None);
        assert_eq!(values.len(), 3);
        
        if let LiNo::Ref(ref_id1) = &values[0] {
            assert_eq!(ref_id1, "normal");
        } else {
            panic!("Expected first value to be Ref variant");
        }
        
        if let LiNo::Ref(ref_id2) = &values[1] {
            assert_eq!(ref_id2, "multi\nline");
        } else {
            panic!("Expected second value to be Ref variant");
        }
        
        if let LiNo::Ref(ref_id3) = &values[2] {
            assert_eq!(ref_id3, "single");
        } else {
            panic!("Expected third value to be Ref variant");
        }
    } else {
        panic!("Expected Link variant");
    }
}

#[test]
fn single_character_multiline_string_test() {
    let source = r#"("a")"#;
    let links = parse_lino_to_links(source).unwrap();
    assert_eq!(links.len(), 1);
    
    
    match &links[0] {
        LiNo::Link { id, values } => {
            assert_eq!(id, &None);
            assert_eq!(values.len(), 1);
            if let LiNo::Ref(ref_id) = &values[0] {
                assert_eq!(ref_id, "a");
            } else {
                panic!("Expected Ref variant, got: {:?}", values[0]);
            }
        }
        LiNo::Ref(ref_id) => {
            // It might be parsed as a simple reference instead of a link
            assert_eq!(ref_id, "a");
        }
    }
}