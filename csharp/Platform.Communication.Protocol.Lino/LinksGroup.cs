using System;
using System.Collections.Generic;
using System.Runtime.CompilerServices;
using Platform.Collections;
using Platform.Collections.Lists;

#pragma warning disable CS1591 // Missing XML comment for publicly visible type or member

namespace Platform.Communication.Protocol.Lino
{
    /// <summary>
    /// <para>
    /// The links group.
    /// </para>
    /// <para></para>
    /// </summary>
    public struct LinksGroup : IEquatable<LinksGroup>
    {
        /// <summary>
        /// <para>
        /// Gets or sets the link value.
        /// </para>
        /// <para></para>
        /// </summary>
        public Link Link
        {
            [MethodImpl(MethodImplOptions.AggressiveInlining)]
            get;
            [MethodImpl(MethodImplOptions.AggressiveInlining)]
            set;
        }

        /// <summary>
        /// <para>
        /// Gets or sets the groups value.
        /// </para>
        /// <para></para>
        /// </summary>
        public IList<LinksGroup> Groups
        {
            [MethodImpl(MethodImplOptions.AggressiveInlining)]
            get;
            [MethodImpl(MethodImplOptions.AggressiveInlining)]
            set;
        }

        /// <summary>
        /// <para>
        /// Initializes a new <see cref="LinksGroup"/> instance.
        /// </para>
        /// <para></para>
        /// </summary>
        /// <param name="link">
        /// <para>A link.</para>
        /// <para></para>
        /// </param>
        /// <param name="groups">
        /// <para>A groups.</para>
        /// <para></para>
        /// </param>
        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public LinksGroup(Link link, IList<LinksGroup> groups)
        {
            Link = link;
            Groups = groups;
        }

        /// <summary>
        /// <para>
        /// Initializes a new <see cref="LinksGroup"/> instance.
        /// </para>
        /// <para></para>
        /// </summary>
        /// <param name="link">
        /// <para>A link.</para>
        /// <para></para>
        /// </param>
        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public LinksGroup(Link link) : this(link, null) { }

        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public static implicit operator List<Link>(LinksGroup value) => value.ToLinksList();

        /// <summary>
        /// <para>
        /// Returns the links list.
        /// </para>
        /// <para></para>
        /// </summary>
        /// <returns>
        /// <para>The list.</para>
        /// <para></para>
        /// </returns>
        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public List<Link> ToLinksList()
        {
            var list = new List<Link>();
            AppendToLinksList(list);
            return list;
        }

        /// <summary>
        /// <para>
        /// Appends the to links list using the specified list.
        /// </para>
        /// <para></para>
        /// </summary>
        /// <param name="list">
        /// <para>The list.</para>
        /// <para></para>
        /// </param>
        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public void AppendToLinksList(List<Link> list) => AppendToLinksList(list, Link, this);

        /// <summary>
        /// <para>
        /// Appends the to links list using the specified list.
        /// </para>
        /// <para></para>
        /// </summary>
        /// <param name="list">
        /// <para>The list.</para>
        /// <para></para>
        /// </param>
        /// <param name="dependency">
        /// <para>The dependency.</para>
        /// <para></para>
        /// </param>
        /// <param name="group">
        /// <para>The group.</para>
        /// <para></para>
        /// </param>
        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public static void AppendToLinksList(List<Link> list, Link dependency, LinksGroup group)
        {
            list.Add(dependency);
            var groups = group.Groups;
            if (!groups.IsNullOrEmpty())
            {
                for (int i = 0; i < groups.Count; i++)
                {
                    var innerGroup = groups[i];
                    AppendToLinksList(list, dependency.Combine(innerGroup.Link), innerGroup);
                }
            }
        }

        /// <summary>
        /// <para>
        /// Determines whether this instance equals.
        /// </para>
        /// <para></para>
        /// </summary>
        /// <param name="obj">
        /// <para>The obj.</para>
        /// <para></para>
        /// </param>
        /// <returns>
        /// <para>The bool</para>
        /// <para></para>
        /// </returns>
        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public override bool Equals(object obj) => obj is LinksGroup linksGroup ? Equals(linksGroup) : false;

        /// <summary>
        /// <para>
        /// Gets the hash code.
        /// </para>
        /// <para></para>
        /// </summary>
        /// <returns>
        /// <para>The int</para>
        /// <para></para>
        /// </returns>
        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public override int GetHashCode() => (Link, Groups.GenerateHashCode()).GetHashCode();

        /// <summary>
        /// <para>
        /// Determines whether this instance equals.
        /// </para>
        /// <para></para>
        /// </summary>
        /// <param name="other">
        /// <para>The other.</para>
        /// <para></para>
        /// </param>
        /// <returns>
        /// <para>The bool</para>
        /// <para></para>
        /// </returns>
        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public bool Equals(LinksGroup other) => Link == other.Link && Groups.EqualTo(other.Groups);

        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public static bool operator ==(LinksGroup left, LinksGroup right) => left.Equals(right);

        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public static bool operator !=(LinksGroup left, LinksGroup right) => !(left == right);
    }
}
