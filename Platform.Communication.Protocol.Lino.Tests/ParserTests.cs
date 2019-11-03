using System.Linq;
using Xunit;

namespace Platform.Communication.Protocol.Lino.Tests
{
    public static class ParserTests
    {
        [Fact]
        public static void ParseAndStringifyTest()
        {
            var source = @"(papa (3: loves mama))
(son 3)
(everyone 3)
(3 (is (loves mama)))
(point)
(point: point point)";
            var parser = new Parser();
            var links = parser.Parse(source);
            var target = links.Format();
            Assert.Equal(source, target);
        }
    }
}
