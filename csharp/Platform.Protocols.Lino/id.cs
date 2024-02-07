#pragma warning disable CS1591 // Missing XML comment for publicly visible type or member

using System.Runtime.CompilerServices;

namespace Platform.Protocols.Lino
{
    public readonly struct Id<TLinkAddress>
    {
        public readonly TLinkAddress ID;

        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public Id(TLinkAddress id) => ID = id;

        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public static explicit operator Id<TLinkAddress>(TLinkAddress id) => new(id);
    }
}