"""
    s2(array, phase[; len][, plans][, directions,] periodic = false)
    s2(array, SeparableIndicator(χ₁, χ₂)[; len][, plans][,directions,] periodic = false)
    s2(array, InseparableIndicator(χ)[; len][,directions,] periodic = false)

Calculate `S₂` (two point) correlation function for one-, two- or
three-dimensional multiphase system.

`S₂(x)` equals to probability that corner elements of a line segment
with the length `x` cut from the array belong to the same phase. This
implementation calculates `S₂(x)` for all `x`es in the range from `1`
to `len` which defaults to half of the minimal dimenstion of the
array.

More generally, you can provide indicator function `χ` instead of
`phase`. In this case `S₂` function calculates probability of `χ(x,
y)` returing `true` where `x` and `y` are two corners of a line
segment. Indicator functions must be wrapped in either
`SeparableIndicator` or `InseparableIndicator`. Some computations for
separable indicator functions are optimized.

An argument `plans` can be used to support precomputed FFT plans which
can be helpful if you call `s2` often with the array of the same
size. Plans can be computed with `S2FTPlans` constructor.

# Examples
```jldoctest
julia> s2([1,1,1,0,1,1], 1; len = 6)[:x]
6-element Array{Float64,1}:
 0.8333333333333334
 0.6
 0.5
 0.6666666666666666
 1.0
 1.0
```

See also: [`direction1Dp`](@ref), [`direction2Dp`](@ref),
[`direction3Dp`](@ref), [`SeparableIndicator`](@ref),
[`InseparableIndicator`](@ref), [`S2FTPlans`](@ref).
"""
function s2 end

maybe_pad_with_zeros(slice :: AbstractVector   , :: Torus) = slice
maybe_pad_with_zeros(slice :: AbstractVector{T}, :: Plane) where T =
    vcat(zeros(T, length(slice)), slice)

expand_coefficient(:: Plane) = 2
expand_coefficient(:: Torus) = 1

struct S2FTPlans{F, I}
    forward :: Dict{Int, F}
    inverse :: Dict{Int, I}
end

Base.in(key :: Int, plans :: S2FTPlans) = key ∈ keys(plans.forward)

"""
    S2FTPlans(array, Plane())
    S2FTPlans(array, Torus())

Create FFT plans for faster calculation of two-point, surface-surface
and surface-void  correlation functions. `Plane()` corresponds to CW
boundary conditions and `Torus()` corresponds to periodic boundary
conditions.

See also: [`s2`](@ref), [`surfsurf`](@ref), [`surfvoid`](@ref).
"""
function S2FTPlans(array    :: AbstractArray,
                   topology :: Topology)
    m = expand_coefficient(topology)
    fft_plans  = Dict(s => zeros(Float64, m*s) |> plan_rfft for s in size(array))
    ifft_plans = Dict(s => plan_irfft(fft_plans[s] * zeros(Float64, m*s), m*s) for s in size(array))
    return S2FTPlans(fft_plans, ifft_plans)
end

"""
    S2FTPlans(array, periodic)

Create FFT plans for faster calculation of two-point, surface-surface
and surface-void  correlation functions. Periodic boundary conditions
are used when `periodic` is `true`, otherwise CW boundary conditions
are used.
"""
S2FTPlans(array :: AbstractArray, periodic :: Bool) =
    S2FTPlans(array, periodic ? Torus() : Plane())

function s2(array      :: AbstractArray,
            indicator  :: SeparableIndicator;
            len        :: Integer        = (array |> size |> minimum) ÷ 2,
            directions :: Vector{Symbol} = array |> default_directions,
            periodic   :: Bool           = false,
            plans      :: S2FTPlans      = S2FTPlans(array, periodic))
    cd = CorrelationData(len, check_directions(directions, size(array), periodic))
    topology = periodic ? Torus() : Plane()
    χ1, χ2 = indicator_function(indicator)

    for direction in directions
        success = cd.success[direction]
        total = cd.total[direction]
        slicer = slice_generators(array, periodic, Val(direction))

        for slice in slicer
            # Get plans for FFT and inverse FFT
            slen = length(slice)
            local fft, ifft

            ind1 = maybe_pad_with_zeros(map(χ1, slice), topology)

            if slen ∈ plans
                fft  = plans.forward[slen]
                ifft = plans.inverse[slen]
            else
                l = length(ind1)
                fft  = plan_rfft(ind1)
                ifft = plan_irfft(zeros(ComplexF64, l >> 1 + 1), l)
            end

            fft1 = fft * ind1
            fft2 = (χ1 === χ2) ? fft1 : fft * maybe_pad_with_zeros(map(χ2, slice), topology)
            s2 = ifft * (fft1 .* conj.(fft2))

            # Number of correlation lengths
            shifts = min(len, slen)

            # Update success and total
            success[1:shifts] .+= s2[1:shifts]
            if periodic
                total[1:shifts] .+= slen
            else
                update_runs!(total, slen, shifts)
            end
        end
    end

    return cd
end

function s2(array      :: AbstractArray,
            indicator  :: InseparableIndicator;
            len        :: Integer        = (array |> size |> minimum) ÷ 2,
            directions :: Vector{Symbol} = array |> default_directions,
            periodic   :: Bool           = false)
    cd = CorrelationData(len, check_directions(directions, size(array), periodic))
    χ = indicator_function(indicator)

    for direction in directions
        slicer = slice_generators(array, periodic, Val(direction))

        for slice in slicer
            slen = length(slice)
            # Number of shifts (distances between two points for this slice)
            shifts = min(len, slen)

            # Calculate slices where χ(slice[x]) && χ(slice[x+y]) for
            # all y's from 1 to len.
            cd.success[direction][1:shifts] .+= Iterators.map(1:shifts) do shift
                # Periodic slice, if needed
                pslice = periodic ? vcat(slice, slice[1:shift-1]) : slice
                plen = periodic ? slen+shift-1 : slen
                mapreduce(χ, +, pslice, view(pslice, shift:plen))
            end

            # Calculate total number of slices with lengths from 1 to len
            if periodic
                cd.total[direction][1:shifts] .+= slen
            else
                update_runs!(cd.total[direction], slen, shifts)
            end
        end
    end

    return cd
end

s2(array      :: AbstractArray,
   phase;
   len        :: Integer        = (array |> size |> minimum) ÷ 2,
   directions :: Vector{Symbol} = array |> default_directions,
   periodic   :: Bool           = false,
   plans      :: S2FTPlans      = S2FTPlans(array, periodic)) =
       s2(array, SeparableIndicator(x -> x == phase);
          len        = len,
          directions = directions,
          periodic   = periodic,
          plans      = plans)
