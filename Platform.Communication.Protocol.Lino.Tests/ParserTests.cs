using Xunit;

namespace Platform.Communication.Protocol.Lino.Tests
{
    public static class ParserTests
    {
        [Fact]
        public static void BasicTest()
        {
            var parser = new Parser();
            var links = parser.Parse(@"(papa (3: loves mama))
(son 3)
(everyone 3)
(3 (is (loves mama)))
(point)
(point: point point)");
            Assert.Equal("papa", links[0].Values[0].Id);
            Assert.Equal("point", links[4].Id);
        }
    }
}
