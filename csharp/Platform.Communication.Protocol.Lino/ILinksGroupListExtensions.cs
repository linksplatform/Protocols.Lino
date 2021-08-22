using System.Collections.Generic;
using System.Runtime.CompilerServices;

#pragma warning disable CS1591 // Missing XML comment for publicly visible type or member

namespace Platform.Communication.Protocol.Lino
{
    /// <summary>
    /// <para>
    /// Represents the links group list extensions.
    /// </para>
    /// <para></para>
    /// </summary>
    public static class ILinksGroupListExtensions
    {
        /// <summary>
        /// <para>
        /// Returns the links list using the specified groups.
        /// </para>
        /// <para></para>
        /// </summary>
        /// <param name="groups">
        /// <para>The groups.</para>
        /// <para></para>
        /// </param>
        /// <returns>
        /// <para>The list.</para>
        /// <para></para>
        /// </returns>
        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public static List<Link> ToLinksList(this IList<LinksGroup> groups)
        {
            var list = new List<Link>();
            for (var i = 0; i < groups.Count; i++)
            {
                groups[i].AppendToLinksList(list);
            }
            return list;
        }
    }
}
