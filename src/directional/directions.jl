"""
    direction1Dp(sym)

Return true if `sym` is 1D direction or false otherwise.

The only possible 1D direction is `:x`.
"""
function direction1Dp end

"""
    direction2Dp(sym)

Return true if `sym` is 2D direction or false otherwise.

 Known directions are:

* `:x` and `:y`. Correlation functions are computed along unit vectors
   `(1, 0)` and `(0, 1)` respectively.
* `:xy` and `:yx`. Correlation functions are computed in diagonal
   directions `(1, 1)` and `(-1, 1)` respectively.
"""
function direction2Dp end

"""
    direction3Dp(sym)

Return true if `sym` is 3D direction or false otherwise.

 Known directions are:

* `:x`, `:y` and `:z`. Correlation functions are computed along unit
   vectors `(1, 0, 0)`, `(0, 1, 0)` and `(0, 0, 1)` respectively.
* `:xy`, `:xz` and `:yz`. Correlation functions are computed in
   diagonal directions `(1, 1, 0)`, `(1, 0, 1)` and `(0, 1, 1)`
   respectively.
* `:yx`, `:zx` and `:zy`. Correlation functions are computed in
   diagonal directions `(-1, 1, 0)`, `(-1, 0, 1)` and `(0, -1, 1)`
   respectively.
* `xyz`, `yxz`, `xzy` and `zyx`. Corresponding directions are
   `(1, 1, 1)`, `(-1, 1, 1)`, `(1, -1, 1)` and `(1, 1, -1)`.
"""
function direction3Dp end

macro def_direction_predicate(name)
    exp = 
        quote
            $name(x :: Symbol) = x |> Val |> $name
            $name(  :: Any) = false
        end
    return esc(exp)
end

macro def_direction(predicate, sym)
    return :($predicate(:: Val{$sym}) = true)
end

@def_direction_predicate direction1Dp
@def_direction_predicate direction2Dp
@def_direction_predicate direction3Dp

@def_direction(direction1Dp, :x)

@def_direction(direction2Dp, :x)
@def_direction(direction2Dp, :y)
@def_direction(direction2Dp, :xy)
@def_direction(direction2Dp, :yx)

@def_direction(direction3Dp, :x)
@def_direction(direction3Dp, :y)
@def_direction(direction3Dp, :z)
@def_direction(direction3Dp, :xy)
@def_direction(direction3Dp, :yz)
@def_direction(direction3Dp, :xz)
@def_direction(direction3Dp, :yx)
@def_direction(direction3Dp, :zy)
@def_direction(direction3Dp, :zx)

@def_direction(direction3Dp, :xyz)
@def_direction(direction3Dp, :yxz)
@def_direction(direction3Dp, :xzy)
@def_direction(direction3Dp, :zyx)

"""
    default_directions(array)

Get default direction in which correlation functions are calculated
for the given array.
"""
function default_directions end

default_directions(x :: AbstractArray) = x |> ndims |> Val |> default_directions
default_directions(:: Val{3}) = [:x, :y, :z]
default_directions(:: Val{2}) = [:x, :y]
default_directions(:: Val{1}) = [:x]

"""
    direction_predicate(ndims)

Get direction predicate for specified number of dimensions `ndims`.
"""
function direction_predicate end

direction_predicate(x :: Integer) = x |> Val |> direction_predicate
direction_predicate(:: Val{3}) = direction3Dp
direction_predicate(:: Val{2}) = direction2Dp
direction_predicate(:: Val{1}) = direction1Dp
direction_predicate(:: Any) = error("Wrong number of dimensions")

function check_directions(directions :: Vector{Symbol},
                          shape      :: Tuple,
                          periodic   :: Bool)
    ndims = length(shape)
    predicate = direction_predicate(ndims)
    directions = unique(directions)

    if !all(predicate, directions)
        error("Unknown directions found.")
    end

    cubic = all(x -> x == shape[1], shape)
    axial = all(x -> x ∈ [:x, :y, :z], directions)
    if periodic && !axial && !cubic
        error("Periodic diagonals for non-cubic arrays are not supported")
    end

    return directions
end

"""
    unit_length(direction)

Return length of one unit (pixel or voxel) in chosen direction.

# Examples
```jldoctest
julia> unit_length(:x)
1.0
```

```jldoctest
julia> unit_length(:xy)
1.4142135623730951
```

```jldoctest
julia> unit_length(:xyz)
1.7320508075688772
```
"""
function unit_length end

macro def_unit_length(sym, expr)
    return :(unit_length(:: Val{$sym}) = $expr)
end

unit_length(direction :: Symbol) = direction |> Val |> unit_length
@def_unit_length :x sqrt(1.0)
@def_unit_length :y sqrt(1.0)
@def_unit_length :z sqrt(1.0)

@def_unit_length :xy sqrt(2.0)
@def_unit_length :yx sqrt(2.0)
@def_unit_length :yz sqrt(2.0)
@def_unit_length :zy sqrt(2.0)
@def_unit_length :xz sqrt(2.0)
@def_unit_length :zx sqrt(2.0)

@def_unit_length :xyz sqrt(3.0)
@def_unit_length :xzy sqrt(3.0)
@def_unit_length :zyx sqrt(3.0)
@def_unit_length :yxz sqrt(3.0)
