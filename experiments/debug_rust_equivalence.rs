use lino::parse_lino_to_links;

fn main() {
    let version1 = "empInfo\n  employees:\n    (\n      name (James Kirk)\n      age 40\n    )\n    (\n      name (Jean-Luc Picard)\n      age 45\n    )\n    (\n      name (Wesley Crusher)\n      age 27\n    )";

    let version2 = "empInfo\n  (\n    employees:\n      (\n        name (James Kirk)\n        age 40\n      )\n      (\n        name (Jean-Luc Picard)\n        age 45\n      )\n      (\n        name (Wesley Crusher)\n        age 27\n      )\n  )";

    let result1 = parse_lino_to_links(version1).unwrap();
    let result2 = parse_lino_to_links(version2).unwrap();

    let formatted1 = result1.iter().map(|l| format!("{}", l)).collect::<Vec<_>>().join("\n");
    let formatted2 = result2.iter().map(|l| format!("{}", l)).collect::<Vec<_>>().join("\n");

    println!("=== VERSION 1 OUTPUT ===");
    println!("{}", formatted1);
    println!();
    println!("=== VERSION 2 OUTPUT ===");
    println!("{}", formatted2);
    println!();
    println!("=== ARE THEY EQUAL? ===");
    println!("{}", formatted1 == formatted2);
}
