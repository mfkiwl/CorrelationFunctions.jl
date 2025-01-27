using CorrelationFunctions
using XUnit
using Distributions: Poisson
using Base.Iterators: zip, drop, countfrom
using Statistics: mean
using Images: feature_transform, distance_transform
using LinearAlgebra: norm
using CUDA: CuArray

# Test utilities
include("utility.jl")

@testset "Short sequences"     begin include("short.jl") end
@testset "Random data"         begin include("random.jl") end
@testset "Checkboard data"     begin include("checkboard.jl") end
@testset "Value noise"         begin include("value-noise.jl") end
@testset "Overlapping disks"   begin include("disks.jl") end
@testset "Overlapping balls"   begin include("balls.jl") end
@testset "Correlation maps"    begin include("maps.jl") end
@testset "Supplementary stuff" begin include("supplementary.jl") end

let test_gpu = get(ENV, "CORRFUNCS_TEST_GPU", "")
    if test_gpu == "yes"
        @testset "Test GPU implementation" begin include("gpu.jl") end
    end
end
