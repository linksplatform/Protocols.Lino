use ln::Ln;

#[test]
fn links_group_constructor_equivalent_test() {
    // Test creating a nested structure equivalent to LinksGroup
    let root = Ln::Ref("root".to_string());
    let children = vec![
        Ln::Ref("child1".to_string()),
        Ln::Ref("child2".to_string()),
    ];
    let group = Ln::Link {
        id: Some("group".to_string()),
        values: vec![root.clone()].into_iter().chain(children.clone()).collect(),
    };
    
    if let Ln::Link { id, values } = group {
        assert_eq!(id, Some("group".to_string()));
        assert_eq!(values.len(), 3); // root + 2 children
        assert_eq!(values[0], root);
    } else {
        panic!("Expected Link variant");
    }
}

#[test]
fn links_group_to_list_flattens_structure_test() {
    // Test creating and flattening a nested structure
    let root = Ln::Ref("root".to_string());
    let child1 = Ln::Ref("child1".to_string());
    let child2 = Ln::Ref("child2".to_string());
    let grandchild = Ln::Ref("grandchild".to_string());
    
    // Create nested structure: root with child1 and (child2 with grandchild)
    let nested_child = Ln::Link::<String> {
        id: None,
        values: vec![child2.clone(), grandchild.clone()],
    };
    
    let group = Ln::Link {
        id: None,
        values: vec![root.clone(), child1.clone(), nested_child],
    };
    
    // Verify the structure
    if let Ln::Link { id, values } = group {
        assert_eq!(id, None);
        assert_eq!(values.len(), 3);
        assert_eq!(values[0], root);
        assert_eq!(values[1], child1);
        
        // Check nested structure
        if let Ln::Link { id: nested_id, values: nested_values } = &values[2] {
            assert_eq!(*nested_id, None);
            assert_eq!(nested_values.len(), 2);
            assert_eq!(nested_values[0], child2);
            assert_eq!(nested_values[1], grandchild);
        }
    }
}

#[test]
fn links_group_to_string_test() {
    // Test string representation of nested structure
    let root = Ln::Ref("root".to_string());
    let children = vec![
        Ln::Ref("child1".to_string()),
        Ln::Ref("child2".to_string()),
    ];
    let group = Ln::Link::<String> {
        id: None,
        values: vec![root].into_iter().chain(children).collect(),
    };
    
    let str_output = group.to_string();
    assert!(str_output.contains("root"));
    assert!(str_output.contains("child1"));
    assert!(str_output.contains("child2"));
    assert!(str_output.contains("(") && str_output.contains(")")); // Should be wrapped in parentheses
}