using System;
using Xunit;

namespace Platform.Protocols.Lino.Tests
{
    public static class MixedIndentationModesTests
    {
        [Fact]
        public static void HeroExampleMixedModesTest()
        {
            var input = @"empInfo
  employees:
    (
      name (James Kirk)
      age 40
    )
    (
      name (Jean-Luc Picard)
      age 45
    )
    (
      name (Wesley Crusher)
      age 27
    )";

            var parser = new Parser();
            var result = parser.Parse(input);

            Assert.NotEmpty(result);
            var formatted = result.Format();
            Assert.Contains("empInfo", formatted);
            Assert.Contains("employees", formatted);
            Assert.Contains("James Kirk", formatted);
            Assert.Contains("Jean-Luc Picard", formatted);
            Assert.Contains("Wesley Crusher", formatted);
        }

        [Fact]
        public static void HeroExampleAlternativeFormatTest()
        {
            var input = @"empInfo
  (
    employees:
      (
        name (James Kirk)
        age 40
      )
      (
        name (Jean-Luc Picard)
        age 45
      )
      (
        name (Wesley Crusher)
        age 27
      )
  )";

            var parser = new Parser();
            var result = parser.Parse(input);

            Assert.NotEmpty(result);
            var formatted = result.Format();
            Assert.Contains("empInfo", formatted);
            Assert.Contains("employees:", formatted);
            Assert.Contains("James Kirk", formatted);
            Assert.Contains("Jean-Luc Picard", formatted);
            Assert.Contains("Wesley Crusher", formatted);
        }

        [Fact]
        public static void HeroExampleEquivalenceTest()
        {
            var version1 = @"empInfo
  employees:
    (
      name (James Kirk)
      age 40
    )
    (
      name (Jean-Luc Picard)
      age 45
    )
    (
      name (Wesley Crusher)
      age 27
    )";

            var version2 = @"empInfo
  (
    employees:
      (
        name (James Kirk)
        age 40
      )
      (
        name (Jean-Luc Picard)
        age 45
      )
      (
        name (Wesley Crusher)
        age 27
      )
  )";

            var parser = new Parser();
            var result1 = parser.Parse(version1);
            var result2 = parser.Parse(version2);

            Assert.NotEmpty(result1);
            Assert.NotEmpty(result2);

            var formatted1 = result1.Format();
            var formatted2 = result2.Format();

            Assert.Equal(formatted1, formatted2);
        }

        [Fact]
        public static void SetContextWithoutColonTest()
        {
            var input = @"empInfo
  employees";

            var parser = new Parser();
            var result = parser.Parse(input);

            Assert.NotEmpty(result);
            var formatted = result.Format();
            Assert.Contains("empInfo", formatted);
            Assert.Contains("employees", formatted);
        }

        [Fact]
        public static void SequenceContextWithColonTest()
        {
            var input = @"employees:
  James Kirk
  Jean-Luc Picard
  Wesley Crusher";

            var parser = new Parser();
            var result = parser.Parse(input);

            Assert.NotEmpty(result);
            Assert.Single(result);
            var formatted = result.Format();
            Assert.Contains("employees:", formatted);
            Assert.Contains("James Kirk", formatted);
            Assert.Contains("Jean-Luc Picard", formatted);
            Assert.Contains("Wesley Crusher", formatted);
        }

        [Fact]
        public static void SequenceContextWithComplexValuesTest()
        {
            var input = @"employees:
  (
    name (James Kirk)
    age 40
  )
  (
    name (Jean-Luc Picard)
    age 45
  )";

            var parser = new Parser();
            var result = parser.Parse(input);

            Assert.NotEmpty(result);
            Assert.Single(result);
            var formatted = result.Format();
            Assert.Contains("employees:", formatted);
            Assert.Contains("James Kirk", formatted);
            Assert.Contains("Jean-Luc Picard", formatted);
        }

        [Fact]
        public static void NestedSetAndSequenceContextsTest()
        {
            var input = @"company
  departments:
    engineering
    sales
  employees:
    (name John)
    (name Jane)";

            var parser = new Parser();
            var result = parser.Parse(input);

            Assert.NotEmpty(result);
            var formatted = result.Format();
            Assert.Contains("company", formatted);
            Assert.Contains("departments:", formatted);
            Assert.Contains("employees:", formatted);
        }

        [Fact]
        public static void DeeplyNestedMixedModesTest()
        {
            var input = @"root
  level1
    level2:
      value1
      value2
    level2b
      level3";

            var parser = new Parser();
            var result = parser.Parse(input);

            Assert.NotEmpty(result);
            var formatted = result.Format();
            Assert.Contains("root", formatted);
            Assert.Contains("level2:", formatted);
        }
    }
}
