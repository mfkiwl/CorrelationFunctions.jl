@testset "Check distance transform (2D)" begin
    foreach(1:5) do _
        a = BitArray(rand(0:1, (100, 100)))
        @test CorrelationFunctions.edt(a, CorrelationFunctions.Plane()) ==
            a |> feature_transform |> distance_transform
    end
end

@testset "Check distance transform (3D)" begin
    foreach(1:5) do _
        a = BitArray(rand(0:1, (100, 100, 100)))
        @test CorrelationFunctions.edt(a, CorrelationFunctions.Plane()) ==
            a |> feature_transform |> distance_transform
    end
end
