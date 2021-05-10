resource "aws_s3_bucket" "tests" {
  bucket        = "tests-${var.prefix}-${var.name}-${var.env}"
  acl           = "public-read"
  force_destroy = true
  versioning {
    enabled = false
  }

  policy = jsonencode({
    "Version" = "2012-10-17"
    "Id"      = "Policy-public-read-1"
    "Statement" = [
      {
        "Sid"    = "AllowPublicRead"
        "Effect" = "Allow"
        "Principal" = {
          "AWS" = "*"
        }
        "Action"   = "s3:GetObject"
        "Resource" = "arn:aws:s3:::tests-${var.prefix}-${var.name}-${var.env}/*"
      }
    ]
  })


  tags = {
    name    = "terraform bucket for data for the lageso"
    project = "flsshygn"
    type    = "storage"
  }

}

