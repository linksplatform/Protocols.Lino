using System.Runtime.CompilerServices;

namespace Platform.Protocols.Lino
{
    /// <summary>
    /// A readonly struct that explicitly represents a link identifier/address.
    /// This type is used to distinguish between regular values and explicit identifiers in link construction.
    /// </summary>
    /// <typeparam name="TLinkAddress">The type used for link addresses/identifiers.</typeparam>
    public readonly struct id<TLinkAddress>
    {
        /// <summary>
        /// Gets the identifier value.
        /// </summary>
        public readonly TLinkAddress Id;

        /// <summary>
        /// Initializes a new identifier with the specified value.
        /// </summary>
        /// <param name="id">The identifier value.</param>
        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public id(TLinkAddress id) => Id = id;

        /// <summary>
        /// Explicitly converts a value to an identifier struct.
        /// </summary>
        /// <param name="id">The value to convert to an identifier.</param>
        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public static explicit operator id<TLinkAddress>(TLinkAddress id) => new (id);
    }
}
