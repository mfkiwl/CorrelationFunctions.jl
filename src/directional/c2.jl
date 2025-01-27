const max_labels_for_ft = 50

function c2fft(labels     :: AbstractArray;
               directions :: Vector{Symbol},
               len        :: Integer,
               periodic   :: Bool,
               plans      :: S2FTPlans = S2FTPlans(labels, periodic))
    cd = CorrelationData(len, check_directions(directions, size(labels), periodic))
    topology = periodic ? Utilities.Torus() : Utilities.Plane()
    maxlabel = maximum(labels)

    for direction in directions
        success = cd.success[direction]
        total   = cd.total[direction]
        slicer  = slice_generators(labels, periodic, Val(direction))

        for slice in slicer
            slen = length(slice)
            local fft, ifft

            if slen ∈ plans
                fft  = plans.forward[slen]
                ifft = plans.inverse[slen]
            else
                l = slen * expand_coefficient(topology)
                fft  = plan_rfft(zeros(Float64, l))
                ifft = plan_irfft(zeros(ComplexF64, l >> 1 + 1), l)
            end

            slice_contrib_ft = mapreduce(+, 1:maxlabel) do label
                ind  = maybe_pad_with_zeros(slice .== label, topology)
                ft   = fft * ind
                s2ft = abs2.(ft)
            end

            slice_contrib = ifft * slice_contrib_ft
            shifts = min(len, slen)

            success[1:shifts] .+= slice_contrib[1:shifts]
            if periodic
                total[1:shifts] .+= slen
            else
                update_runs!(total, slen, shifts)
            end
        end
    end

    return cd
end

"""
    c2(array, phase[; len,][directions,] periodic = false)

Calculate `C₂` (cluster) correlation function for one-, two- or
three-dimensional multiphase system.

`C₂(x)` equals to probability that corner elements of a line segment
with the length `x` cut from the array belong to the same
cluster of the specific phase. This implementation calculates C2 for
all `x`es in the range from `1` to `len` which defaults to half of the
minimal dimension of the array.

# Examples
```jldoctest
julia> c2([1,1,1,0,1,1], 1; len = 6)[:x]
6-element Array{Float64,1}:
 0.8333333333333334
 0.6
 0.25
 0.0
 0.0
 0.0
```

For a list of possible dimensions, see also: [`direction1Dp`](@ref),
[`direction2Dp`](@ref), [`direction3Dp`](@ref).
"""
function c2(array      :: AbstractArray,
            phase;
            directions :: Vector{Symbol} = array |> default_directions,
            len        :: Integer = (array |> size |> minimum) ÷ 2,
            periodic   :: Bool = false)
    field = map(x -> x == phase, array)
    labels = label_components(field, periodic ? Utilities.Torus() : Utilities.Plane())
    if maximum(labels) < max_labels_for_ft
        return c2fft(labels; directions, len, periodic)
    else
        return s2(labels,InseparableIndicator((x, y) -> x == y != 0);
                  len, directions, periodic)
    end
end
