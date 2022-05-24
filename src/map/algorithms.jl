function cross_correlation(a)
    F = plan_rfft(a)
    A = F * a
    C = @. abs2(A)
    inv(F) * C
end


function cross_correlation(a::CuArray)
    A = similar(a, ComplexF32) .= a
    fft!(A)
    @. A = abs2(A)
    ifft!(A) |> real
end


function cross_correlation(a, b)
    F = plan_rfft(a)
    A = F * a
    B = F * b
    C = @. conj(A) * B
    inv(F) * C
end


function cross_correlation(a::CuArray, b::CuArray)
    A = similar(a, ComplexF32) .= a
    B = similar(a, ComplexF32) .= b
    fft!(A)
    fft!(B)
    @. B *= conj(A)
    ifft!(B) |> real
end


function cnt_total_(c; periodic=false, original=false)
    if periodic
        [length(c)]
    else
        if original
            ixes = map(size(c)) do s
                collect(s:-1:1)
            end
        else
            ixes = map(axes(c), size(c)) do ix, es
                s = (es + 1) ÷ 2
                cnt = @. s - abs(ix - s)
                ifftshift(cnt)
            end
        end
        map(ixes, 1:length(ixes)) do cnt, d
            if d == 1
                cnt
            elseif d == 2
                reshape(cnt, 1, :)
            elseif d == 3
                reshape(cnt, 1, 1, :)
            end
        end
    end
end


cnt_total(c; periodic=false, original=false) = cnt_total_(c; periodic, original)
cnt_total(c::CuArray; periodic=false, original=false) = cnt_total_(c; periodic, original) .|> cu


function expand(image)
    esize = [2s - 1 for s in size(image)]
    e_image = similar(image, esize...) .= zero(eltype(image))
    e_image[axes(image)...] .= image
    e_image
end


function gradient_norm(img, kernelfactor=KernelFactors.sobel)
    dimgs = imgradients(img, kernelfactor)

    map((x...) -> norm(x), dimgs...)
end


function gradient_norm(img::CuArray, kernelfactor=KernelFactors.sobel)
    imgCPU = Array(img)
    cu(gradient_norm(imgCPU, kernelfactor))
end


function size_slice(img::AbstractArray{T, 3}, dim::Int) where T
    if dim == 1
        size(img)[2:3]
    elseif dim == 2
        (size(img, 1), size(img, 3))
    elseif dim == 3
        size(img)[1:2]
    else
        error("dim is not in {1, 2, 3}")
    end
end


function size_slice(img::AbstractArray{T, 2}, dim::Int) where T
    if dim == 1
        (size(img, 2),)
    elseif dim == 2
        (size(img, 1),)
    else
        error("dim is not in {1, 2}")
    end
end


function size_slice(img::AbstractVector, dim::Int)
    if dim == 1
        ()
    else
        error("dim is not 1")
    end
end
