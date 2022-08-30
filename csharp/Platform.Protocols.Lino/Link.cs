using System;
using System.Collections.Generic;
using System.Runtime.CompilerServices;
using System.Text;
using Platform.Collections;
using Platform.Collections.Lists;

#pragma warning disable CS1591 // Missing XML comment for publicly visible type or member

namespace Platform.Protocols.Lino
{
    public struct Link<TLinkAddress> : IEquatable<Link<TLinkAddress>>
    {
        private readonly EqualityComparer<TLinkAddress> _equalityComparer = EqualityComparer<TLinkAddress>.Default;

        public readonly TLinkAddress? Id;

        public readonly IList<Link<TLinkAddress>> Values;

        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public Link(TLinkAddress id, IList<Link<TLinkAddress>> values) => (Id, Values) = (id, values);

        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public Link(IList<Link<TLinkAddress>> values) : this(default!, values) { }

        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public Link(params Link<TLinkAddress>[] values) : this(default!, values) { }

        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public Link(TLinkAddress id) : this(id, default!) { }

        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public override string ToString() => Values.IsNullOrEmpty() ? $"({EscapeReference(Id.ToString())})" : GetLinkValuesString();

        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        private string GetLinkValuesString() => Id == null ? $"({GetValuesString()})" : $"({EscapeReference(Id.ToString())}: {GetValuesString()})";

        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public string GetValuesString()
        {
            var sb = new StringBuilder();
            for (int i = 0; i < Values.Count; i++)
            {
                if (i > 0)
                {
                    sb.Append(' ');
                }
                sb.Append(GetValueString(Values[i]));
            }
            return sb.ToString();
        }

        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public Link<TLinkAddress> Simplify()
        {
            if (Values.IsNullOrEmpty())
            {
                return this;
            }
            else if (Values.Count == 1)
            {
                return Values[0];
            }
            else
            {
                var newValues = new Link<TLinkAddress>[Values.Count];
                for (int i = 0; i < Values.Count; i++)
                {
                    newValues[i] = Values[i].Simplify();
                }
                return new Link<TLinkAddress>(Id, newValues);
            }
        }

        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public Link<TLinkAddress> Combine(Link<TLinkAddress> other) => new Link<TLinkAddress>(this, other);

        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public static string GetValueString(Link<TLinkAddress> value) => value.ToLinkOrIdString();

        public static string EscapeReference(string reference)
        {
            if  (
                    reference.Contains(":") ||
                    reference.Contains("(") ||
                    reference.Contains(")") ||
                    reference.Contains(" ") ||
                    reference.Contains("\t") ||
                    reference.Contains("\n") ||
                    reference.Contains("\r") ||
                    reference.Contains("\"")
                )
            {
                return $"'{reference}'";
            }
            else if (reference.Contains("'"))
            {
                return $"\"{reference}\"";
            }
            else
            {
                return reference;
            }
        }

        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public string ToLinkOrIdString() => Values.IsNullOrEmpty() ? Id == null ? "" : EscapeReference(Id.ToString()) : ToString();

        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public static implicit operator Link<TLinkAddress>(TLinkAddress value) => new Link<TLinkAddress>(value);

        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public static implicit operator Link<TLinkAddress>((TLinkAddress, IList<Link<TLinkAddress>>) value) => new (value.Item1, value.Item2);

        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public static implicit operator Link<TLinkAddress>((Link<TLinkAddress> source, Link<TLinkAddress> target) value) => new (value.source, value.target);

        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public static implicit operator Link<TLinkAddress>((id<TLinkAddress> id, Link<TLinkAddress> source, Link<TLinkAddress> target) value) => new (value.id.Id, new [] { value.source, value.target });

        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public static implicit operator Link<TLinkAddress>((Link<TLinkAddress> source, Link<TLinkAddress> linker, Link<TLinkAddress> target) value) => new (value.source, value.linker, value.target);
        
        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public static implicit operator Link<TLinkAddress>((id<TLinkAddress> id, Link<TLinkAddress> source, Link<TLinkAddress> linker, Link<TLinkAddress> target) value) => new (value.id.Id, new [] { value.source, value.linker, value.target });

        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public override bool Equals(object obj) => obj is Link<TLinkAddress> link && Equals(link);

        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public override int GetHashCode() => (Id, Values.GenerateHashCode()).GetHashCode();

        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public bool Equals(Link<TLinkAddress> other) => Id != null && other.Id != null && _equalityComparer.Equals(Id, other.Id) && Values.EqualTo(other.Values);

        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public static bool operator ==(Link<TLinkAddress> left, Link<TLinkAddress> right) => left.Equals(right);

        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public static bool operator !=(Link<TLinkAddress> left, Link<TLinkAddress> right) => !(left == right);
    }
}
