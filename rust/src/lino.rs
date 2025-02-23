use std::fmt;

#[derive(Debug, Clone)]
pub enum LiNo<T> {
  Ref(T),
  Seq { id: Option<T>, values: Vec<Self> },
}

impl<T> LiNo<T> {
  pub fn is_ref(&self) -> bool {
    matches!(self, LiNo::Ref(_))
  }

  pub fn is_seq(&self) -> bool {
    matches!(self, LiNo::Seq { .. })
  }
}

impl<T: fmt::Display> fmt::Display for LiNo<T> {
  fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
    match self {
      LiNo::Ref(value) => value.fmt(f),
      LiNo::Seq { id, values } => {
        let id = id.as_ref().map(|id| format!("{id}: ")).unwrap_or_default();

        if f.alternate() {
          let lines = values
            .iter()
            .map(|value| format!("{id}{value}"))
            .collect::<Vec<_>>()
            .join("\n");
          write!(f, "{}", lines)
        } else {
          let values = values
            .iter()
            .map(ToString::to_string)
            .collect::<Vec<_>>()
            .join(" ");
          write!(f, "({id}{values})")
        }
      }
    }
  }
}
