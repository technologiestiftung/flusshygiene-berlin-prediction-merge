resource "aws_s3_bucket" "uploads" {
  bucket        = "${var.prefix}-${var.name}-${var.env}"
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
        "Resource" = "arn:aws:s3:::${var.prefix}-${var.name}-${var.env}/*"
      }
    ]
  })

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["GET", "HEAD"]
    allowed_origins = ["*"]
    expose_headers  = ["ETag"]
    max_age_seconds = 3000
  }
  tags = {
    name    = "terraform bucket for data for the lageso"
    project = "flsshygn"
    type    = "storage"
  }

}

